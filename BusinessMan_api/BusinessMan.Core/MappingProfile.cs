using AutoMapper;
using BusinessMan.Core.DTO_s;
using BusinessMan.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessMan.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<FileUpload, FileDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UserPostModel, User>()
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.LastLogin, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.BusinessId, opt => opt.Ignore())
                .ForMember(dest => dest.Business, opt => opt.Ignore())
                .ForMember(dest => dest.Invoices, opt => opt.Ignore())
                .ReverseMap();
        }
    }
}