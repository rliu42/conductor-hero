class Drawing:
    def __init__(self):
        self.spheres = []
    def add_sphere(self, sphere):
    	self.spheres.append(sphere)
        #print result

class Sphere:
    def __init__(self, position, radius=1):
        self.radius = radius
        self.position = position