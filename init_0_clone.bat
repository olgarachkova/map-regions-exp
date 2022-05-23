@echo off
REM SETLOCAL EnableDelayedExpansion

REM git clone git@bitbucket.org:calabanteam/currentfe.git
echo ========

REM CD %~dp0src\jscore\core
REM FOR /F "delims=" %%i IN ('DIR /B/a') DO (RMDIR "%%i" /s/q || DEL "%%i" /s/q)
REM git clone git@bitbucket.org:calabanteam/ts_core.git -b winter20 .
REM echo ========

CD %~dp0src\jscore\jssn
FOR /F "delims=" %%i IN ('DIR /b/a') DO (RMDIR "%%i" /s/q || DEL "%%i" /s/q)
git clone git@bitbucket.org:calabanteam/ts_net.git .
echo ========

CD %~dp0src\jscore\db
FOR /F "delims=" %%i IN ('DIR /b/a') DO (RMDIR "%%i" /s/q || DEL "%%i" /s/q)
git clone git@bitbucket.org:calabanteam/ts_db.git .
echo ========

CD %~dp0src\jscore\func
FOR /F "delims=" %%i IN ('DIR /b/a') DO (RMDIR "%%i" /s/q || DEL "%%i" /s/q)
git clone git@bitbucket.org:calabanteam/ts_func.git .
echo ========

REM CD %~dp0src\jscore\dev
REM FOR /F "delims=" %%i IN ('DIR /b/a') DO (RMDIR "%%i" /s/q || DEL "%%i" /s/q)
REM git clone git@bitbucket.org:calabanteam/ts_dev.git .
REM echo ========