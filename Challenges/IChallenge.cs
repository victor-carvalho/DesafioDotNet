using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Challenges
{
    public interface IChallenge
    {
        Task<ChallengeResult> Check(StreamReader input, StreamReader output);
    }
}
