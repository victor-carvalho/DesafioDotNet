using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Jobs
{
    interface IChallengeJob
    {
        Task RunAsync(Guid id, string zipPath);
    }
}
