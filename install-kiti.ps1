# Instalador do Kiti CLI via curl
Write-Host "Instalando Kiti CLI..."

$installDir = "$env:USERPROFILE\KitiCLI"

if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir | Out-Null
}

Write-Host "Baixando kiti.exe da última release..."
$downloadUrl = "https://github.com/Kiti-Co/Kiti-CLI/releases/latest/download/kiti.exe"
$dest = "$installDir\kiti.exe"

curl -L $downloadUrl -o $dest

Write-Host "Adicionando ao PATH..."
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($oldPath -notlike "*KitiCLI*") {
    $newPath = "$oldPath;$installDir"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
}

Write-Host "`nInstalação concluída!"
Write-Host "Reinicie o terminal e execute: kiti"
