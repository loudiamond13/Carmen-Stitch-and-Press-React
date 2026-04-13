using System;
using System.Collections.Generic;
using System.Text;

namespace CSPS.Domain.Entities
{
    public class MoneyTransfer
    {
        public int MoneyTransfersId { get; set; }

        public string TransferFrom { get; set; }

        public string TransferTo { get; set; }

        public DateTime TransferDate { get; set; }

        public decimal TransferAmount { get; set; }

        public string TransferBy { get; set; }

        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
