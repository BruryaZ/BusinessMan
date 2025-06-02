using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessMan.Data.Migrations
{
    /// <inheritdoc />
    public partial class Journalentries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_JournalEntries",
                table: "JournalEntries");

            migrationBuilder.RenameTable(
                name: "JournalEntries",
                newName: "Journal-entries");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Journal-entries",
                table: "Journal-entries",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Journal-entries",
                table: "Journal-entries");

            migrationBuilder.RenameTable(
                name: "Journal-entries",
                newName: "JournalEntries");

            migrationBuilder.AddPrimaryKey(
                name: "PK_JournalEntries",
                table: "JournalEntries",
                column: "Id");
        }
    }
}
