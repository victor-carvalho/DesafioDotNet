using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Models
{
    public class Result
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string Output { get; set; }
        public bool Done { get; set; }
        public bool IsCorrect { get; set; }
        public string ErrorMessage { get; set; }

        public Challenge Challenge { get; set; }
    }
}
