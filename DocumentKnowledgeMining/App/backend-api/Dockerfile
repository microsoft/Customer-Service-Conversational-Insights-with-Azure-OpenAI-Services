# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 9001

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release

WORKDIR /src
COPY ["Microsoft.GS.DPS.Host/Microsoft.GS.DPS.Host.csproj", "./Microsoft.GS.DPS.Host/"]
COPY ["Microsoft.GS.DPS/Microsoft.GS.DPS.csproj", "./Microsoft.GS.DPS/"]
RUN dotnet restore "./Microsoft.GS.DPS.Host/Microsoft.GS.DPS.Host.csproj"
COPY . .
WORKDIR "/src/Microsoft.GS.DPS.Host"
RUN dotnet build "./Microsoft.GS.DPS.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Microsoft.GS.DPS.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
USER root
RUN apt-get update \
    && apt-get install -y libfontconfig

WORKDIR /app
COPY --from=publish /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:9001
ENV ASPNETCORE_HTTP_PORTS=9001

EXPOSE 9001

ENTRYPOINT ["dotnet", "Microsoft.GS.DPS.Host.dll"]