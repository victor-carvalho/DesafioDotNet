using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Challenges
{
    public class MinMaxSomaChallenge : IChallenge
    {
        private string Solve(int[] values)
        {
            var min = Int32.MaxValue;
            var max = Int32.MinValue;
            var sum = 0;

            foreach (var value in values)
            {
                if (value > max)
                {
                    max = value;
                }
                if (value < min)
                {
                    min = value;
                }

                sum += value;
            }

            return $"{sum - max} {sum - min}";
        }

        public async Task<ChallengeResult> Check(StreamReader input, StreamReader output)
        {
            var inputLine = (await input.ReadLineAsync())?.Trim();
            if (inputLine == null)
                return null;

            var expectedOutput = (await output.ReadLineAsync())?.Trim();
            if (expectedOutput == null)
                return null;

            var parts = inputLine.Split(' ');
            if (parts.Length != 5)
                return null;

            try
            {
                var values = Array.ConvertAll(parts, Convert.ToInt32);

                if (values.Any(x => x < 1 || x > 1_000_000_000))
                    return null;

                return new ChallengeResult(Solve(values), expectedOutput);
            }
            catch (FormatException)
            {
                return null;
            }
        }
    }
}
