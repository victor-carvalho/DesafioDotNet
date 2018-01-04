using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Challenges
{
    public class QuaseOrdenadoChallenge : IChallenge
    {

        private string Solve(int[] values, int n)
        {
            var l = 0;
            var r = n - 1;

            while (l < r && values[l] < values[l + 1])
                l++;

            while (r > l && values[r] > values[r - 1])
                r--;

            if (l == r)
                return "SIM";

            if ((l > 0 && values[r] < values[l - 1]) || (r < n - 1 && values[l] > values[r + 1]))
                return "NÃO";

            var i = l;
            while (i < r && values[i] > values[i + 1])
                i++;

            if (i == r)
                return (r - l < 2) ? $"SIM\nswap {l + 1} {r + 1}" : $"SIM\nreverse {l + 1} {r + 1}";

            if (i == l)
            {
                for (i = l + 1; i < r && values[i] < values[i + 1]; i++) ;

                if (i == r && values[l] > values[r - 1] && values[r] > values[l + 1])
                    return $"SIM\nswap {l + 1} {r + 1}";
            }

            return "NÃO";
        }

        public async Task<ChallengeResult> Check(StreamReader input, StreamReader output)
        {
            var sizeLine = (await input.ReadLineAsync())?.Trim();
            var inputLine = (await input.ReadLineAsync())?.Trim();
            var expectedOutput = (await output.ReadToEndAsync())?.Trim();

            if (sizeLine == null || inputLine == null || expectedOutput == null)
                return null;

            try
            {
                var n = Convert.ToInt32(sizeLine);
                var values = Array.ConvertAll(inputLine.Split(' '), Convert.ToInt32);

                if (n < 2 || n > 100000 || values.Length != n || values.Any(x => x < 0 || x > 1_000_000))
                    return null;

                return new ChallengeResult(Solve(values, n), expectedOutput);
            }
            catch (FormatException)
            {
                return null;
            }
        }
    }
}
