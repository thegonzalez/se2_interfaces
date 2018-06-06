# se2_interfaces

We are using nine interfaces to study pose transformation

Six of those interfaces use the cursor, and the other three use speech

## Cursor
  ### Arrows
    Mouse click:
      When the user clicks on one of the arrows, the end effector will translate in the direction of that arrow as the user moves the cursor. When the user clicks a second time, the end effector will stop moving. If the user clicks on the ring around the end effector, the end effector will subsequently rotate as they move the cursor around the window. When the user clicks a second time, the end effector will stop 
    Mouse drag:
      The user can drag the end effector along one of the four cardinal directions by using the arrows. They can also click on the ring and drag it in order to change the orientation of the end effector.
      
 ### Drag
    Mouse click:
      Once the user clicks on the end effector, it follows their cursor as they move there cursor around the window. When the user clicks a second time, the end effector stops moving. If the user clicks on the ring around the end effector, the end effector will subsequently rotate as they move the cursor around the window. When the user clicks a second time, the end effector will stop rotating. 
    Mouse drag:
      The user can drag the end effector to any desired position. They can also click on the ring and drag in order to change the orientation of the end effector.

 ### Target
    Mouse click:
      The user's first click determines the positon of the end effector (where it will move to). The user then moves the cursor around to determine the end effector's orienatation. The end effector will point from where the mouse was first click to where the mouse is clicked for the second time. 
    Mouse drag:
      Upon a mousedown even (the user presses the mouse down) the position of the end effector is set. The user can then drag the mouse around and let up the mouse when the desired orientation has been achieved. 
      
## Speech
  ### Cardinal directions (arrows)
    
  ### Trajectory arrows
  
  ### Grid

