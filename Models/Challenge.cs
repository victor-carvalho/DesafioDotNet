using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Models
{
    public class Challenge
    {
        public Guid Id { get; set; }
        public bool Done { get; set; }
        public string FileName { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime StartTime { get; set; }
        public string ChallengeType { get; set; }

        public ICollection<Result> Results { get; set; }
    }
}
