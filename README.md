# THEASYS Tour Download File use instructions

Hi! Thank you for using **Theasys** to download your tour. Following are some quick instructions on how to run your tour either offline or online.

> Please note that the provided files need to be placed on a server in order for your tour to run.

# Offline Use

Usually a local server runs on the address http://localhost. Let's assume that you need to run your tour on the following local address: http://localhost/mytour/. Go to your local server files and create a new folder called "mytour". Place all Theasys Tour provided files into this folder.

Locate file config.js and open it with your favorite editor (notepad, notepad++, sublime, atom, etc) and on line 9 change path from `http://localhost` to `http://localhost/mytour/`.

Visit tour via your browser at the address http://localhost/mytour/

# Online Use

Let's assume that you need to run your tour on the following website address: https://www.mywebsite.com/mytour/.  Use your favorite ftp progam (FileZilla, Cyberduck, etc) and connect to your website root directory. Create a new folder called "mytour". Upload all Theasys Tour provided files into this folder.

Note: before uploading your files online, on your computer locate file config.js (Theasys Tour provided files) and open it with your favorite editor (notepad, notepad++, sublime, atom, etc) and on line 9 change path from `http://localhost` to `https://www.mywebsite.com/mytour/`. Please note that there is a difference between `https://` and `http://` depending if you run your website on SSL or not.

Visit tour via your browser at the address https://www.mywebsite.com/mytour/

## Google maps key

If your tour uses a map, then you need to have a Google maps api key. If you haven't already provided Theasys with your api key during purchase and download procedure you can change it manually.

Locate file index.html and open it with your favorite editor (notepad, notepad++, sublime, atom, etc) and on line 56 where it says:

    <script src="//maps.googleapis.com/maps/api/js?libraries=geometry&language=en&key=GOOGLE_MAPS_API_KEY"></script>

change "GOOGLE_MAPS_API_KEY" with your key.

For more information on how to issue an api key, please visit https://developers.google.com/maps/documentation/embed/get-api-key

## Support

You can always contact support at support@theasys.io or visit the F.A.Q. section on our website https://www.theasys.io/faq/
