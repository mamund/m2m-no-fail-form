README m2m-no-fail-form

This examples shows how servers can handle "no-fail" form templates when dealing
with M2M scenarios.

PARTIAL FORMS ARE ACCEPTED
The pattern for "no-fail forms" is to allow clients to submit partial forms
w/o reporting errors. Essentially all inputs are treated as "optional"; client
apps are allowed to post any number of inputs successfully.

A SIMPLE PROMISE; REPEAT UNTIL ALL INPUTS SUPPLIED
The pattern relies on a simple "promise" by the server; to accept partial inputs
and continue to send the request for inputs back in subsequent representations
until the client as completed all inputs. Client apps can continue to look
for any remaining inputs in each representation, fill the inputs in and submit
the data to the server until the representation no longer contains inputs.

THE CLIENT DICTiONARY
This M2M pattern also relies on the client app having access to a "dictionary"
of name-value pairs. This could be in the client code, kept in local storage,
or possibly kept at a remote server location. The client may also have access
to multiple dictionaries of name-value pairs; all available to fill in
hypermedia template inputs.

NO MEANING REQUIRED
This pattern does not require the server or the client to know the _meaning_
of any of the inputs; just the names. A direct match of names is not always
requried. Client apps might use local algorithms to establish "close matches"
to input names (i.e. Soundex[1], language translations, even a synonym
service[2]).

DEFAULTS
Servers are also free to supply default values for any/all inputs. This can
be done any number of ways. For example, the client might be prompted to request
defaults from the server. The client might also be "trained" to pass a special
value ("$default$") that allows the server to supply the value directly (w/o
requiring the client to first request, then return the default values).

THIS EXAMPLE
This example keeps the pattern very simple:
- client dictionary is in the client code
- the server presents all inputs at first and then only presents "missing" inputs
- once the "complete" the complete state is reached, the server is "done"
- no defaults are involved, this client has all the needed values

Future examples will test out additional cases including defaults, multiiple
dictionaries, etc.

MCA

[1] http://en.wikipedia.org/wiki/Soundex
[2] http://googleblog.blogspot.com/2010/01/helping-computers-understand-language.html
