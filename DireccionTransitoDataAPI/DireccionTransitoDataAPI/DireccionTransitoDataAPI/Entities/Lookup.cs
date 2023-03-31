using System.ComponentModel.DataAnnotations;

namespace DireccionTransitoDataAPI.Entities
{
    public class Lookup
    {

        [Required] public int LookupId { get; set; }

        [Required] public string LookupValue { get; set; }

        public Lookup(int lookupId, string lookupValue) { 

            LookupId = lookupId;

            LookupValue = lookupValue;
        
        }

    }
}
