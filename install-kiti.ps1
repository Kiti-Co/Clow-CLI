# Instalador Kiti CLI (via curl)
# Baixa o kiti.exe do GitHub Releases e instala no PATH

Write-Host "Instalando Kiti CLI..."

$installDir = "$env:USERPROFILE\KitiCLI"

if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir | Out-Null
}

Write-Host "Baixando kiti.exe..."
$downloadUrl = "https://github.com/Kiti-Co/Kiti-CLI/releases/latest/download/kiti.exe"
$targetFile = "$installDir\kiti.exe"

Invoke-WebRequest -Uri $downloadUrl -OutFile $targetFile

Write-Host "Adicionando ao PATH..."
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($oldPath -notlike "*$installDir*") {
    $newPath = "$oldPath;$installDir"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}

Write-Host "Instalação concluída!"
Write-Host "Reinicie o terminal e execute: kiti"
