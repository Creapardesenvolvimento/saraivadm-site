#!/bin/sh
# Monta a configuração de e-mail (SMTP) a partir das variáveis de ambiente do Easypanel.
set -e

if [ -n "$SMTP_HOST" ]; then
  cat > /etc/msmtprc <<CONF
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /proc/self/fd/2

account        site
host           $SMTP_HOST
port           ${SMTP_PORT:-587}
from           ${SMTP_FROM:-$SMTP_USER}
user           $SMTP_USER
password       $SMTP_PASS
$( [ "${SMTP_PORT:-587}" = "465" ] && echo "tls_starttls   off" )

account default : site
CONF
  chown www-data:www-data /etc/msmtprc
  chmod 600 /etc/msmtprc
else
  echo "Aviso: SMTP_HOST não definido. O formulário de contato não vai enviar e-mails." >&2
fi

exec "$@"
