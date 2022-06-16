.PHONY: all example test fmt lint

FLAGS=--unstable --config deno.json
PERMS=--allow-hrtime --allow-env

list:
	@echo "Commands available:"
	@echo "make test  - runs all test cases"
	@echo "make fmt   - formates the source code"
	@echo "make lint  - run deno lint on sourc code"
	@echo "make bench - runs benchmarks for the examples"

test:
	LOG_LEVEL=ERROR deno test ${FLAGS} ${PERMS} .

fmt:
	deno fmt ${FLAGS} .

lint:
	deno lint ${FLAGS} .

bench:
	LOG_LEVEL=OFF deno bench ${FLAGS} ${PERMS} .