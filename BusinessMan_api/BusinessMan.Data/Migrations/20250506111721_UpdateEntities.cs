using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessMan.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_emails",
                table: "emails");

            migrationBuilder.RenameTable(
                name: "emails",
                newName: "EmailList");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EmailList",
                table: "EmailList",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EmailList",
                table: "EmailList");

            migrationBuilder.RenameTable(
                name: "EmailList",
                newName: "emails");

            migrationBuilder.AddPrimaryKey(
                name: "PK_emails",
                table: "emails",
                column: "Id");
        }
    }
}
