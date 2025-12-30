# Для отображения русских символов использовать кодировку UTF-8 с BOM

# Установка параметров скрипта
param (
    [string]$venvPath = ".\.venv",  # Путь к виртуальному окружению
    [string]$managePyPath = "backend\manage.py"  # Путь к manage.py
)

function Show-Menu {
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host "Управление проектом на Django " -ForegroundColor Yellow
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host "1. Запустить сервер" -ForegroundColor Green
    Write-Host "2. Открыть Django shell" -ForegroundColor Green
    Write-Host "3. Применить миграции" -ForegroundColor Green
    Write-Host "4. Создать миграции" -ForegroundColor Green
    Write-Host "5. Запустить тесты" -ForegroundColor Green
    Write-Host "6. Создать суперпользователя" -ForegroundColor Green
	Write-Host "7. Создать дамп БД" -ForegroundColor Green
	Write-Host "8. Загрузить дамп в БД" -ForegroundColor Green
    Write-Host "0. Выход" -ForegroundColor Red
    Write-Host "====================================" -ForegroundColor Cyan
}

function Activate-Venv {
    param (
        [string]$path
    )
    
    if (Test-Path $path) {
        $activateScript = Join-Path $path "Scripts\Activate.ps1"
        if (Test-Path $activateScript) {
            & $activateScript
            Write-Host "Виртуальное окружение активировано: $path" -ForegroundColor Green
            return $true
        } else {
            Write-Host "Не найден скрипт активации в: $activateScript" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "Виртуальное окружение не найдено по пути: $path" -ForegroundColor Red
        return $false
    }
}

function Run-DjangoServer {
    Write-Host "Запуск сервера Django..." -ForegroundColor Yellow
    python $managePyPath runserver
}

function Open-DjangoShell {
    Write-Host "Открытие Django shell..." -ForegroundColor Yellow
    python $managePyPath shell
}

function Apply-Migrations {
    Write-Host "Применение миграций..." -ForegroundColor Yellow
    python $managePyPath migrate
}

function Make-Migrations {
    Write-Host "Создание миграций..." -ForegroundColor Yellow
    python $managePyPath makemigrations
}

function Run-Tests {
    Write-Host "Запуск тестов..." -ForegroundColor Yellow
    python $managePyPath test
}

function Create-Superuser {
    Write-Host "Создание суперпользователя..." -ForegroundColor Yellow
    python $managePyPath createsuperuser
}

function Dump-Data {
    Write-Host "Дампирование базы данных в db.json..." -ForegroundColor Yellow
    python -Xutf8 $managePyPath dumpdata --output db.json
}

function Load-Data {
    Write-Host "Загрузка данных из db.json в базу данных..." -ForegroundColor Yellow
    python $managePyPath loaddata db.json
}

# Основная логика скрипта
try {
    # Активация виртуального окружения
    if (-not (Activate-Venv -path $venvPath)) {
	Write-Host "Ошибка активации venv"
	Pause        
	exit 1
    }

    # Главный цикл меню
    do {
        Show-Menu
        $selection = Read-Host "Выберите опцию (1-8 или 0 для выхода)"
        
        switch ($selection) {
            '1' { Run-DjangoServer }
            '2' { Open-DjangoShell }
            '3' { Apply-Migrations }
            '4' { Make-Migrations }
            '5' { Run-Tests }
            '6' { Create-Superuser }
			'7' { Dump-Data }
			'8' { Load-Data }
            '0' { 
                Write-Host "Выход..." -ForegroundColor Yellow
                deactivate
                exit 0 
            }
            default { Write-Host "Неверный выбор, попробуйте снова." -ForegroundColor Red }
        }
        
        if ($selection -ne '0') {
            Pause
        }
    } while ($selection -ne '0')
}
catch {
	Write-Host "Произошла ошибка: $_" -ForegroundColor Red
	Pause
	exit 1
}
