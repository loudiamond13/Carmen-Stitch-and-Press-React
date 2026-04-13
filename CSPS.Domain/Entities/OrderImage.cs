using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Entities
{
    public partial class OrderImage
    {
        public int ImageId { get; set; }

        public int OrderId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;
        public string PublicId { get; set; } = string.Empty;

        public virtual Order Order { get; set; }
    }
}
