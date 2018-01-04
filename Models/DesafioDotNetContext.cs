using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DesafioDotNet.Models
{
    public class DesafioDotNetContext : DbContext
    {
        public DesafioDotNetContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Challenge> Challenges { get; set; }
        public DbSet<Result> Results { get; set; }
    }
}
