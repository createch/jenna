start: stop serve
	compass watch web

serve:
	cd web && nohup python -m SimpleHTTPServer 12345 &

stop:
	python stop.py
	rm -f nohup.out
