using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Models
{
    public class FilterModel
    {
        public string Id { get; set; } = string.Empty;
        public string Operator { get; set; } = "=";
        public string Value { get; set; } = string.Empty;
    }
}
