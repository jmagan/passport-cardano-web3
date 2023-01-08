ESLINT ?= eslint

lint-eslint:
	$(ESLINT) --fix $(SOURCES)

lint-tests-eslint:
	$(ESLINT) --fix $(TESTS)


.PHONY: lint-eslint lint-tests-eslint
