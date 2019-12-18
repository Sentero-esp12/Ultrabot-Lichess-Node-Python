## compute_input.py

import sys, json

#Read data from stdin
#def read_in():
    #print ('123')
    #lines = sys.stdin.readlines()
    #sys.stdin.flush()
    #return json.loads(lines[0])
def read_in():
#data=sys.stdin.read().splitlines()
#for i in data:
        #print i
        #return data
        data=sys.stdin.buffer.read(5000)
        sys.stdin.flush()
        print (data)
        #print ('test')
        #while True:
            #val = self.file.buffer.read(1)
            #print (val)
            #if val == "8":
                #break
            #self.value += val
        #return self.value
        return '123'


def main():
    #get our data as an array from read_in()
    lines = read_in()

    #create a numpy array
    #np_lines = np.array(lines)

    #use numpys sum method to find sum of all elements in the array
    #lines_sum = np.sum(np_lines)

    #return the sum to the output stream
    #print lines_sum
    #for line in lines:
    print (lines)
    print ('test')
    sys.stdout.flush()
#start process
if __name__ == '__main__':
    main()
