using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Challenges
{
    public class ChallengeResult
    {
        public ChallengeResult(string output, string expected)
        {
            this.Output = output;
            this.IsCorrect = output == expected;
        }

        public string Output { get; set; }
        public bool IsCorrect { get; set; }
    }
}
