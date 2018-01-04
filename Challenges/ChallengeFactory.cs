using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Challenges
{
    public static class ChallengeFactory
    {
        public static IChallenge CreateChallenge(string challengeType)
        {
            switch (challengeType)
            {
                case "canguru":
                    return new CanguruChallenge();
                case "minmaxsoma":
                    return new MinMaxSomaChallenge();
                case "quaseordenado":
                    return new QuaseOrdenadoChallenge();
                default:
                    throw new ArgumentException(challengeType, "challengeType");
            }
        }
    }
}
