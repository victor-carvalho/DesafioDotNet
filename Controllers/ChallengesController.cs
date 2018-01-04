using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using DesafioDotNet.Challenges;
using DesafioDotNet.Jobs;
using DesafioDotNet.Models;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DesafioDotNet.Controllers
{
    [Route("api/[controller]")]
    public class ChallengesController : Controller
    {
        private readonly DesafioDotNetContext _context;

        public ChallengesController(DesafioDotNetContext context)
        {
            this._context = context;
        }

        [HttpGet]
        public async Task<IActionResult> LastChallenges()
        {
            var challenges = await this._context.Challenges
                .OrderByDescending(c => c.StartTime)
                .AsNoTracking()
                .Take(10)
                .ToListAsync();

            return Ok(challenges);
        }

        [HttpGet("{id}", Name = "GetChallenge")]
        public async Task<IActionResult> GetChallenge(Guid id)
        {
            var challenge = await this._context.Challenges
                .Include(c => c.Results)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (challenge == null)
                return NotFound();

            return Ok(challenge);
        }

        [HttpPost]
        public async Task<IActionResult> NewChallenge(IFormFile file, string type)
        {
            if (type == null || file == null || Path.GetExtension(file.FileName) != ".zip")
                return BadRequest(new { Message = "É necessário fornecer um arquivo \".zip\"" });

            Guid id = Guid.NewGuid();

            var path = Path.GetTempFileName();
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "Files", id.ToString());

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            ZipFile.ExtractToDirectory(path, basePath);
            System.IO.File.Delete(path);

            if (Directory.Exists(Path.Combine(basePath, "input")) && Directory.Exists(Path.Combine(basePath, "output")))
            {
                var challenge = new Challenge
                {
                    Id = id,
                    ChallengeType = type,
                    FileName = file.FileName,
                    StartTime = DateTime.Now,
                    EndTime = null
                };
                await _context.Challenges.AddAsync(challenge);
                await _context.SaveChangesAsync();

                BackgroundJob.Enqueue<IChallengeJob>(j => j.RunAsync(id, basePath));

                challenge.Results = new Result[] { };

                return AcceptedAtRoute("GetChallenge", new { Id = id }, challenge);
            }

            return BadRequest(new { Message = "O arquivo precisa possuir uma pasta input e uma pasta output"});
        }
    }
}
