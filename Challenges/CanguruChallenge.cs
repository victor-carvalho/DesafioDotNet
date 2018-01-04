using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Challenges
{
    public class CanguruChallenge : IChallenge
    {
        private string Solve(int x1, int v1, int x2, int v2)
        {
            var quotient = Math.DivRem(x2 - x1, v1 - v2, out int remainder);
            return (remainder == 0 && quotient > 0) ? "SIM" : "NÃO";
        }

        public async Task<ChallengeResult> Check(StreamReader input, StreamReader output)
        {
            var inputLine = (await input.ReadLineAsync())?.Trim();
            if (inputLine == null)
                return null;

            var expectedOutput = (await output.ReadLineAsync())?.Trim();
            if (expectedOutput == null)
                return null;

            var values = inputLine.Split(' ');
            if (values.Length == 4)
            {
                try
                {
                    var x1 = Convert.ToInt32(values[0]);
                    var v1 = Convert.ToInt32(values[1]);
                    var x2 = Convert.ToInt32(values[2]);
                    var v2 = Convert.ToInt32(values[3]);

                    if (x1 >= 0 && x2 > x1 && x2 <= 1000 && v1 >= 1 && v1 <= 10000 && v1 >= 1 && v2 <= 10000)
                        return new ChallengeResult(Solve(x1, v1, x2, v2), expectedOutput);

                    return null;
                }
                catch (FormatException)
                {
                    return null;
                }
            }

            return null;
        }
    }
}
