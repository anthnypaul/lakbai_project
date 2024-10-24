.PHONY: test api-test db-test frontend-test

test:
	/Users/anthnypaul/Desktop/lakbai_env/bin/python -m pytest -v tests/

api-test:
	@export TESTING=True && /Users/anthnypaul/Desktop/lakbai_env/bin/python -m pytest -v tests/test_api.py

db-test:
	@export TESTING=True && /Users/anthnypaul/Desktop/lakbai_env/bin/python -m pytest -v tests/test_database.py