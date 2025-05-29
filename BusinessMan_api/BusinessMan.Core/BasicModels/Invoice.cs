using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BusinessMan.Core.Models
{
    public enum InvoiceType
    {
        Income = 0,         // הכנסה
        Expense = 1,        // הוצאה
        AssetIncrease = 2,  // עלייה בנכסים
        AssetDecrease = 3,  // ירידה בנכסים
        LiabilityIncrease = 4,  // עלייה בהתחייבויות
        LiabilityDecrease = 5,  // ירידה בהתחייבויות
        EquityIncrease = 6,  // עלייה בהון עצמי
        EquityDecrease = 7   // ירידה בהון עצמי
    }

    public class Invoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public decimal AmountDebit { get; set; }
        public decimal AmountCredit { get; set; }
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        public int Status { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string UpdatedBy { get; set; }
        public string InvoicePath { get; set; }

        public int? UserId { get; set; } = null;
        public int? BusinessId { get; set; } = null;
        public Business? Business { get; set; } = null;
        public User? User { get; set; } = null;

        // סוג העסקה
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public InvoiceType Type { get; set; } = InvoiceType.Income;

        public override string ToString()
        {
            return $"Amount debit: {AmountDebit}, Amount credit: {AmountCredit}, Invoice date: {InvoiceDate}, Status: {Status}, Notes: {Notes}, Created at: {CreatedAt}, Created by: {CreatedBy}, Updated at: {UpdatedAt}, Updated by: {UpdatedBy}, Type: {Type}";
        }
    }
}