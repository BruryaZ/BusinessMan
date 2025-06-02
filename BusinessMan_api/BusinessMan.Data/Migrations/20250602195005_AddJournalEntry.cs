using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BusinessMan.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJournalEntry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Equity",
                table: "businesses",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "JournalEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EntryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Debit = table.Column<decimal>(type: "numeric", nullable: false),
                    Credit = table.Column<decimal>(type: "numeric", nullable: false),
                    DebitAccount = table.Column<string>(type: "text", nullable: false),
                    CreditAccount = table.Column<string>(type: "text", nullable: false),
                    InvoiceId = table.Column<int>(type: "integer", nullable: false),
                    BusinessId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JournalEntries", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JournalEntries");

            migrationBuilder.DropColumn(
                name: "Equity",
                table: "businesses");
        }
    }
}
