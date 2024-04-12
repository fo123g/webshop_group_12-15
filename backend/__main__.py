from flask  import Flask 
from jsonreader import read_json_from_file  
import datetime


file_path = 'product.json'
x = datetime.datetime.now()
app = Flask(__name__)

@app.route('/data/')
def get_products():
    json_data = read_json_from_file(file_path)
    
    return json_data
    
if __name__ == '__main__':
    app.run(debug=True)
