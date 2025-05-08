using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core.Extentions
{
    public static class DateTimeExtensions
    {
        public static void ForceAllDateTimesToUtc(this object obj)
        {
            if (obj == null) return;

            var properties = obj.GetType()
                .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(p => p.CanRead && p.CanWrite && p.PropertyType == typeof(DateTime));

            foreach (var prop in properties)
            {
                var value = (DateTime)prop.GetValue(obj)!;

                DateTime newValue = value.Kind switch
                {
                    DateTimeKind.Utc => value,
                    DateTimeKind.Local => value.ToUniversalTime(),
                    DateTimeKind.Unspecified => DateTime.SpecifyKind(value, DateTimeKind.Utc),
                    _ => throw new ArgumentOutOfRangeException()
                };

                prop.SetValue(obj, newValue);
            }
        }
    }
}
