from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import text2emotion as te
import math

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///simulacrum.db'
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.String(200), nullable=False)
    fear = db.Column(db.Float, nullable=False)
    surprise = db.Column(db.Float, nullable=False)
    happy = db.Column(db.Float, nullable=False)
    angry = db.Column(db.Float, nullable=False)
    sad = db.Column(db.Float, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Task %r>' % self.id

# index html
@app.route('/', methods=['POST', 'GET'])
def index():

    # on text input
    if request.method == 'POST':
        task_content = request.form['sentence']

        # get emotions from text
        current_emotion = te.get_emotion(task_content)
        sort_emotions = sorted(current_emotion.items(), key=lambda x: x[1], reverse=True)
        
        # save emotions to var
        for emotion in sort_emotions:
            if(emotion[0] == 'Fear'):
                fear = emotion[1]
            elif(emotion[0] == 'Surprise'):
                surprise = emotion[1]
            elif(emotion[0] == 'Happy'):
                happy = emotion[1]
            elif(emotion[0] == 'Angry'):
                angry = emotion[1]
            elif(emotion[0] == 'Sad'):
                sad = emotion[1]      
                 
        # save emotions to db
        new_task = Todo(content=task_content, fear=fear, surprise=surprise, happy=happy, angry=angry, sad=sad)
        try:
            db.session.add(new_task)
            db.session.commit()

            # send emotions to html
            return render_template("emo.html", emo=sort_emotions, fear=fear, surprise=surprise, happy=happy, angry=angry, sad=sad, txt=task_content)
        except:
            return 'There was an issue adding your task'
    else:
        return render_template("index.html")

@app.route("/gallery")
def gallery():

    # get last 16 queries and render to html
    tasks = Todo.query.order_by(Todo.date_created.desc()).limit(16).all()
    return render_template("gallery.html", tasks=tasks)

@app.route('/img/<int:id>')
def img(id):

    # get one result by ID
    img_fetch = Todo.query.get_or_404(id)

    try:
        db.session.commit()
    except:
        return 'There was an error in fetching'

    fear = ('Fear', img_fetch.fear)
    surprise = ('Surprise', img_fetch.surprise)
    happy = ('Happy', img_fetch.happy)
    angry = ('Angry', img_fetch.angry)
    sad = ('Sad', img_fetch.sad)

    sort_emotions = [fear,surprise,happy,angry,sad]

    # send emotions to HTML
    return render_template('img.html', img=sort_emotions, emo=img_fetch, txt=img_fetch.content)

if __name__ == "__main__":
    app.run(debug=True)