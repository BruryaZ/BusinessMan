using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessMan.Data.Migrations
{
    /// <inheritdoc />
    public partial class DecimalFixWithCast : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"ALTER TABLE invoices 
          ALTER COLUMN ""AmountDebit"" TYPE numeric(18,2) 
          USING ""AmountDebit""::numeric(18,2);");

            migrationBuilder.Sql(
                @"ALTER TABLE invoices 
          ALTER COLUMN ""AmountCredit"" TYPE numeric(18,2) 
          USING ""AmountCredit""::numeric(18,2);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"ALTER TABLE invoices 
          ALTER COLUMN ""AmountDebit"" TYPE text 
          USING ""AmountDebit""::text;");

            migrationBuilder.Sql(
                @"ALTER TABLE invoices 
          ALTER COLUMN ""AmountCredit"" TYPE text 
          USING ""AmountCredit""::text;");
        }

    }
}
