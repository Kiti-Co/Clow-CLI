Write-Host "Instalando Clow CLI..."

$installDir = "$env:USERPROFILE\ClowCLI"

if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir | Out-Null
}

Write-Host "Baixando kiti.exe da última release..."

$downloadUrl = "https://github.com/Kiti-Co/Clow-CLI/releases/latest/download/KitiOS-Server.exe"
$dest = "$installDir\kiti.exe"

# download correto, sem curl
Invoke-WebRequest -Uri $downloadUrl -OutFile $dest

Write-Host "Adicionando ao PATH..."
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($oldPath -notlike "*$installDir*") {
    $newPath = "$oldPath;$installDir"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}

Write-Host ""
Write-Host "Instalação concluída!"
Write-Host "Reinicie o terminal e execute: kiti"
