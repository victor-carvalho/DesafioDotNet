using DesafioDotNet.Challenges;
using DesafioDotNet.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Jobs
{
    public class ChallengeJob : IChallengeJob
    {
        private readonly DesafioDotNetContext _context;
        private string _inputPath;
        private string _outputPath;
        private IChallenge _challengeRunner;
        private ConcurrentQueue<bool> _queue;

        public ChallengeJob(DesafioDotNetContext context)
        {
            this._context = context;
            this._queue = new ConcurrentQueue<bool>();
        }

        public async Task ProcessInput(Result result)
        {
            var inputFile = Path.Combine(_inputPath, result.FileName);
            var outputFile = Path.Combine(_outputPath, result.FileName.Replace("input", "output"));

            using (var inputStream = new StreamReader(inputFile))
            using (var outputStream = new StreamReader(outputFile))
            {
                var challengeResult = await _challengeRunner.Check(inputStream, outputStream);
                if (challengeResult != null)
                {
                    result.IsCorrect = challengeResult.IsCorrect;
                    result.Output = challengeResult.Output;
                }
                else
                {
                    result.ErrorMessage = "Input Inválido";
                }
                result.Done = true;
            }
        }

        public async Task RunAsync(Guid id, string basePath)
        {
            var challenge = await _context.Challenges
                .Include(c => c.Results)
                .FirstOrDefaultAsync(c => c.Id == id);

            _inputPath = Path.Combine(basePath, "input");
            _outputPath = Path.Combine(basePath, "output");
            _challengeRunner = ChallengeFactory.CreateChallenge(challenge.ChallengeType);

            foreach (var file in Directory.GetFiles(_inputPath))
            {
                challenge.Results.Add(new Result { FileName = Path.GetFileName(file) });
            }

            await _context.SaveChangesAsync();

            var tasks = challenge.Results.Select(ProcessInput).ToHashSet();
            while (tasks.Count > 0)
            {
                var task = await Task.WhenAny(tasks);
                await _context.SaveChangesAsync();
                tasks.Remove(task);
            }

            challenge.EndTime = DateTime.Now;
            challenge.Done = true;

            await _context.SaveChangesAsync();
        }
    }
}
