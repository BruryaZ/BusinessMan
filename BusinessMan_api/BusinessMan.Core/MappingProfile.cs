using AutoMapper;
using BusinessMan.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<FileUpload, FileDto>().ReverseMap();
        }
    }
}
