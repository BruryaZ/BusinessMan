using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessMan.Data.Migrations
{
    /// <inheritdoc />
    public partial class emaillist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EmailList",
                table: "EmailList");

            migrationBuilder.RenameTable(
                name: "EmailList",
                newName: "email-list");

            migrationBuilder.AddPrimaryKey(
                name: "PK_email-list",
                table: "email-list",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_email-list",
                table: "email-list");

            migrationBuilder.RenameTable(
                name: "email-list",
                newName: "EmailList");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EmailList",
                table: "EmailList",
                column: "Id");
        }
    }
}
