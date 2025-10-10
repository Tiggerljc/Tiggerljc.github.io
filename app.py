from flask import Flask, render_template, abort
import pathlib

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/template")
def template():
    return render_template("blog-template.html")

@app.route("/blogs/<blog_name>")
def blog(blog_name):
    p = pathlib.Path(app.template_folder) / "blogs" / f"{blog_name}.html"
    if not p.exists():
        abort(404)
    return render_template(f"blogs/{blog_name}.html")

if __name__ == "__main__":
    app.run(debug=True)
