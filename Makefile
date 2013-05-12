start: stop serve
	compass watch web

serve:
	cd web && nohup python -m SimpleHTTPServer &

stop:
	python stop.py
	rm -f nohup.out
