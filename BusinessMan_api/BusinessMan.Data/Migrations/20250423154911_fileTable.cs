using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessMan.Data.Migrations
{
    /// <inheritdoc />
    public partial class fileTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Businesses_BusinessId",
                table: "Invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Users_UserId",
                table: "Invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Businesses_BusinessId",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Invoices",
                table: "Invoices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Examples",
                table: "Examples");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Businesses",
                table: "Businesses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UploadedFiles",
                table: "UploadedFiles");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "users");

            migrationBuilder.RenameTable(
                name: "Invoices",
                newName: "invoices");

            migrationBuilder.RenameTable(
                name: "Examples",
                newName: "examples");

            migrationBuilder.RenameTable(
                name: "Businesses",
                newName: "businesses");

            migrationBuilder.RenameTable(
                name: "UploadedFiles",
                newName: "files");

            migrationBuilder.RenameIndex(
                name: "IX_Users_BusinessId",
                table: "users",
                newName: "IX_users_BusinessId");

            migrationBuilder.RenameIndex(
                name: "IX_Invoices_UserId",
                table: "invoices",
                newName: "IX_invoices_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Invoices_BusinessId",
                table: "invoices",
                newName: "IX_invoices_BusinessId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_users",
                table: "users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_invoices",
                table: "invoices",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_examples",
                table: "examples",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_businesses",
                table: "businesses",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_files",
                table: "files",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_invoices_businesses_BusinessId",
                table: "invoices",
                column: "BusinessId",
                principalTable: "businesses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_invoices_users_UserId",
                table: "invoices",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_users_businesses_BusinessId",
                table: "users",
                column: "BusinessId",
                principalTable: "businesses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_invoices_businesses_BusinessId",
                table: "invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_invoices_users_UserId",
                table: "invoices");

            migrationBuilder.DropForeignKey(
                name: "FK_users_businesses_BusinessId",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_invoices",
                table: "invoices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_examples",
                table: "examples");

            migrationBuilder.DropPrimaryKey(
                name: "PK_businesses",
                table: "businesses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_files",
                table: "files");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "invoices",
                newName: "Invoices");

            migrationBuilder.RenameTable(
                name: "examples",
                newName: "Examples");

            migrationBuilder.RenameTable(
                name: "businesses",
                newName: "Businesses");

            migrationBuilder.RenameTable(
                name: "files",
                newName: "UploadedFiles");

            migrationBuilder.RenameIndex(
                name: "IX_users_BusinessId",
                table: "Users",
                newName: "IX_Users_BusinessId");

            migrationBuilder.RenameIndex(
                name: "IX_invoices_UserId",
                table: "Invoices",
                newName: "IX_Invoices_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_invoices_BusinessId",
                table: "Invoices",
                newName: "IX_Invoices_BusinessId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Invoices",
                table: "Invoices",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Examples",
                table: "Examples",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Businesses",
                table: "Businesses",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UploadedFiles",
                table: "UploadedFiles",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Businesses_BusinessId",
                table: "Invoices",
                column: "BusinessId",
                principalTable: "Businesses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Users_UserId",
                table: "Invoices",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Businesses_BusinessId",
                table: "Users",
                column: "BusinessId",
                principalTable: "Businesses",
                principalColumn: "Id");
        }
    }
}
