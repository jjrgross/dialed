# AGENTS.md

## Cursor Cloud specific instructions

**Dialed** is currently a **greenfield / placeholder repository**. The only tracked file besides this document is `README.md` (title: "Dialed"). There is no application code, package manifest, Docker setup, CI config, or test suite yet.

### Services

| Service | Status |
|---------|--------|
| Application(s) | None defined |
| Database / cache / queue | None defined |
| Docker Compose | Not present |

### Lint / test / run

No lint, test, build, or dev-server commands exist until a stack is chosen and manifests are added (e.g. `package.json`, `pyproject.toml`, `Makefile`, `docker-compose.yml`).

### VM update script

The startup update script is a no-op (`true`) because there are no dependencies to refresh.

### When code is added

After the first real application lands in the repo, update this section with:

- Required services and how to start them (dev mode, not production builds).
- Non-obvious startup caveats (env files, ports, hot-reload quirks).
- Pointers to existing docs (`README.md`, `CONTRIBUTING.md`, etc.) for standard commands — avoid duplicating them here.
