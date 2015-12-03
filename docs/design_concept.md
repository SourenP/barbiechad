# Team: Four

| Team Member            | UNI     |
|------------------------|---------|
| Xin Xu                 | xx2152  |
| Bingyan Hu             | bh2447  |
| Souren Sarkis Papazian | ssp2155 |
| Luis Alberto Ramirez   | lar2195 |

## Description
Four is a web app that generates a playlist from a time-series of values based on a metric. A user chooses points on a graph where the x-axis is time (the length of the playlist) and the y-axis is the value of a metric. They can also specify a genre if they would like to limit the results. After a user submits their points, a playlist is generated that that follows the curve of their points in order to create a stream of songs that transitions smoothly from one level to the next.

Metric examples:
* Tempo
* Pitch
* Loudness
* Energy
* Danceability

### Class of users
This app would be useful for people who want a playlist that transitions smoothly between the given metrics, such as energy or tempo. This applies to groups like DJ’s, who would want smooth changes in their sets, or people who work out, who wants a smooth change of pace in their workout playlist.

## Personas

### Persona A
Chad is a 23 year old local small town DJ.  He has lived in the same town his whole life and attends community college part time.  His hobbies are playing the guitar and hanging out at the library.  He has been hired by the public school system to DJ senior prom.  He wants to create the perfect mix and needs to maintain the correct atmosphere in respect to the time of the night.  This means having bumping sick beats to get the party going at the start of the night and wind down near the end to the all important slow dance.

### Persona B
Barbie is a 40 year old woman who lives in New York and attends her local gym in the mornings. She enjoys listening to music while she’s working out but she usually has her library on shuffle. needs a playlist that matches her workout routine so that the tempo syncs with the intensity of her session. She likes techno music.

## Use Scenarios

### Scenario 1
Chad decides to use BarbieChad to make a prom playlist.  He wants to start with maximum tempo at the beginning of the night and then wind it down with slower songs towards the end. He opens the app and looks over the inputs. He wants to play pop at the prom so he adds the genre from the dropdown list. He then chooses ‘tempo’ as the metric that he wants to graph. He also knows the prom is three hours long so he specifies it in the duration field. Then he adjusts the points in the graph to start off with a high tempo and taper off into a low tempo. Finally, he clicks on the Submit button and looks over the generated playlist. He decides he is satisfied with it and clicks the Save button so he will have easy access to it at his gig.

![Smaller icon]
(https://raw.githubusercontent.com/SourenP/four/master/Chad.png)

### Scenario 2
Barbie decides to use BarbieChad to create a playlist for her workout session. She opens the app and decides to first plot the graph. She sets the duration of the playlist to 1 hour and the graph scale changes accordingly. She then inputs a bunch of data points to make the graph match her workout intensity. Once the graph is ready she inputs the genre techno, sets the metric to ‘energy’ and clicks the Submit button. The playlist gets generated and she saves it. The next day she comes back and decides to also add rock. So she adds the genre rock and clicks submit again to regenerate the playlist. She saves again and is satisfied this time.

![Smaller icon]
(https://raw.githubusercontent.com/SourenP/four/master/Barbie.png)


