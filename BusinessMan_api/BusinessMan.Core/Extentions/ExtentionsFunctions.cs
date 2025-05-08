namespace BusinessMan.Core.Extentions
{
    public static class ExtentionsFunctions
    {
        public static DateTime ForceUtc(DateTime date)
        {
            return date.Kind switch
            {
                DateTimeKind.Utc => date,
                DateTimeKind.Local => date.ToUniversalTime(),
                DateTimeKind.Unspecified => DateTime.SpecifyKind(date, DateTimeKind.Utc),
                _ => throw new ArgumentOutOfRangeException(nameof(date))
            };
        }
    }
}
