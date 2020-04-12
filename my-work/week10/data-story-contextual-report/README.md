### The Data Story Contextual Progress Report

Every year, the technical specification of digital cameras get refreshed and presumably better. Or does it? By going through thousands of digital cameras ever released, the project Digicam in Specs will use their specification sheets as a lens to approach this changing industry in relation to technologies, product design choices, business, and our lifestyles.

#### Subject Research
##### Context
We are all familiar with digital cameras. Since mid-90s, they have been around as a type of consumer electronics. During the almost two decades of the industry, we have witnessed an interplay between technologies, business competitions, product designs, and our changing lifestyles, especially in the ongoing revolution of mobile photography.

The scope of the projects will cover digital cameras dedicated to still phorography, including built-in lens cameras and interchangeable lens cameras. The data range from mid-90s all the way through 2020, that is, from its explorational era, through its booming phase, to today's challenging market. By analyzing the retrospective of technical specs and visualizing them from novel perspectives, we will travel through time to explore the a bigger picture and hopefully identify some critical variables in the course. 

#### Project Progress
##### Collected Data
- [Digital Camera Database](https://www.digicamdb.com/) (Entirely scraped)
    This website provide fairly detailed information of probably the largest set of cameras among similar online databases ([Product Chart](https://www.productchart.com/cameras/), [DXOMark](https://www.dxomark.com/Cameras/)). Most of such databases provide 1-to-1 comparison tools and are meant to give insights for consumer purchases. I scraped through the Digital Camera Database website and stored the raw data into several csv files, which can be accessed [here](https://github.com/yz3440/my-cdv-ss20/tree/master/my-work/week9/digicamdb_scraper).
    For each individual camera product, information about the brand, model name, release year.sensor details (pixels, type, size, ISO), photographic capability (shutter speed range, metering mode, RAW support), camera utilities (viewfinder type, screen type, storage type, video capability),connectivities (Wi-Fi, GPS, HDMI), and the form factor (weight, dimentions).
- [CIPA](http://www.cipa.jp/index_e.html) Statistics
    Camera & Imaging Products Association (CIPA) is an international industry association consisting of members engaged in the development, production or sale of imaging related devices including digital cameras. CIPA provides a number of [statistical reports](http://www.cipa.jp/stats/report_e.html) regarding shipments of different types of cameras and lenses by year and region of destination. Data are provided as PDF reports, which I will need to convert to CSV later. 

##### Visualization & Design
I would like to layout different properties of cameras through time to visualize how the technology, design, business landscape has changed during two decades. Here are some bullet points of elements that I am considering.
- Temporal (Yearly) Changes
    - Number of camera released
        Shown by different type of camera every year.
    - Megapixels & Sensor Size
        A tangible visulization could be a pixelated image with changing resolution zoom into 100% to show the clarity difference.
    - Screen Size
       Maybe visualized in accurate size on the browser.
    - Dimensions
        Presumably catches differences in chunky cameras in earlier time, compact cameras, and chunky pro cameras. Shown with visual reference to the size of a mobile phone of the year.
    - Companies in/out of business
    - TBC
- Correlations
    - Brand Product Strategy
        Plotting product specs in planed categorized by brands.
    - Sensor Size per body size
        Does you get more sensor real estate with bigger / heavier body.
    Some fun correlations could be sensor size per kilogram or sensor pixel density vs. screen pixel density. 

I imagine the website to have a vertical scrolling mechanism to show temporal  changes along with certain events related to some fun facts.

Now that most people take pictures with phones much more than with a dedicated camera, I would like to visualize and help the audience appreciate the retrospective of digital cameras that brought us here in the first place. And I expect the project to be educational about some basic concepts about cameras. 

#### Sources
[Digital Camera Database](https://www.digicamdb.com/), [Camera & Imaging Products Association](http://www.cipa.jp/index_e.html)