# Twitter profile to NetML

The "Twitter profile to NetML" chrome extension scans a twitter profile webpage and summaries key information about the profile in a NetML formatted line of text. 

[NetML](https://munnecke.net/blog/introducing-netml/) is an practical markup language to store network information that is both easily readable to humans and machines. 

The text can easily be copied and pasted into documents where such information is stored, organised and read by programs that can read NetML.
![](popup.png)
By default each entry is store in a stack when the extension is pressed while visiting a twitter profile webpage, so that multiple profiles can be processed before copying the text to the clipboard and pasting elsewhere. The stack is syncronized with the same user profile across browser windows and devices.

*Workflow*
- browse twitter profile webpages and press the "Twitter profile to NetML" chrome extension when you want to save any of them to the stack. If you regret, you can always remove the lastest entry from the stack using the "revert" button.
- press the "clipboard" button when you are done and want to copy the whole stack of NetML formatted entries to a document.
- press "clear" to empty the stack.