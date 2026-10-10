# Portfolio: build the static site and push it to the OVH shared hosting over FTP.
#
#   make build     generate the static site into .output/public (refuses if the dev server is up)
#   make deploy    upload .output/public to the FTP "www" folder (mirror + delete)
#   make release   build then deploy
#   make check     curl the live site after a deploy
#
# Credentials come from .env (git-ignored):
#   OVH_DOMAIN_SECRET=...   FTP password for the OVH login below
# The password is only ever passed to lftp, never echoed.

FTP_HOST ?= ftp.cluster129.hosting.ovh.net
FTP_USER ?= antoifj
FTP_DIR  ?= www
SITE_URL ?= http://antoinegtr.com
DEV_PORT ?= 3000

# Load .env if present (silently) and export its variables to the recipes
-include .env
export

.PHONY: build deploy release check dev

build:
	@if lsof -tiTCP:$(DEV_PORT) -sTCP:LISTEN >/dev/null 2>&1; then \
	  echo "✗ A dev server is listening on port $(DEV_PORT). Stop it first: generating alongside it corrupts .nuxt."; \
	  exit 1; \
	fi
	npx nuxi generate
	@echo "✓ Built .output/public ($$(du -sh .output/public | cut -f1))"

deploy:
	@test -n "$$OVH_DOMAIN_SECRET" || { echo "✗ OVH_DOMAIN_SECRET is not set (put it in .env)"; exit 1; }
	@test -f .output/public/index.html || { echo "✗ No build found, run 'make build' first"; exit 1; }
	@command -v lftp >/dev/null || { echo "✗ lftp is missing: brew install lftp"; exit 1; }
	@echo "→ Uploading .output/public to $(FTP_USER)@$(FTP_HOST):$(FTP_DIR)"
	@lftp -u "$(FTP_USER),$$OVH_DOMAIN_SECRET" $(FTP_HOST) -e "set ftp:ssl-allow false; set cmd:fail-exit true; mirror -R --delete --verbose=1 .output/public $(FTP_DIR); quit"
	@echo "✓ Deployed"

release: build deploy check

check:
	@printf "home     "; curl -s -o /dev/null -w "%{http_code}\n" --max-time 20 $(SITE_URL)/
	@printf "404 page "; curl -s -o /dev/null -w "%{http_code}\n" --max-time 20 $(SITE_URL)/does-not-exist
	@printf "sitemap  "; curl -s -o /dev/null -w "%{http_code}\n" --max-time 20 $(SITE_URL)/sitemap.xml

dev:
	npm run dev -- --host
