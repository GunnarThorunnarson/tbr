Böggar:

verkefni.html
    - böggur í plugin: pop-up calander fer til hægri í hárri upplausn. ekki ef % eru notaðar þá ok í container. issue: https://github.com/flatpickr/flatpickr/issues/3027. Leysti með að setja div wrapper með dimensions, í stað að nota .content í body.
    - gif loopar ekki lengur? held það hafi gerst eftir að breytt stærð,
    - færist til þegar engin verkefni finnast
    - ef texti í leitarreit er ekki til í verkefnum, þá er dagatali samt fully funtional
---------

TODO:

verkefni.html
    - mobile: range sést ekki í notkun í mobile, bæta við takka apply og clear í calander sjálft sjá td. lausn https://www.freecodecamp.org/news/how-to-add-custom-buttons-to-flatpickr/
    - sortera input match við fyrsta staf í input
    - localstorage, til að halda filter, ef smellt er á nemaverkefni/repo
    - bæta error handling getData, bæta við t.d spinner.
    - nota arrow (lyklaborð) til að fara niður listann (li í ul).
    - Fjölga verkefnum
    - setja upp skrifleg leyfismál (t.d. hak í innu við verkefnaskil?)
    - Skoða:  
        - ekki leyfa að skrá inn script í input. ekki lesa úr input og nota, heldur nota string frá JSON
        - ef ég held of lengi click inni á li þá lokast ul, tengja click við mouseup
         - ætti ég að converta strax date í iso861 eða láta duga í calander?

namskra.html
    - bæta við filterum (kjarni, kjarni-tölvubraut, val, bundið val)
    - mobile layout: Þarf að endurhanna css layout og JS  frá grunni. Lausn setti rotate með css og gif sem fix.

afangi.html (index.html)
    - nota JSON 
    - gera module fyrir hvern áfanga, 
    - vantar fleiri ljósmyndir 
    - tengja namskra - afanga - verkefni.
   
skra_verkefni.html (nýtt)
    - búa til form til að skrá í JSON
    - aðgangsstýring login eða github private duga.
