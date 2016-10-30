#!/usr/bin/env python
from __future__ import print_function
from charity.utilities import bcp
import zipfile
import sys

cc_files = {
    "extract_main_charity": [
      "regno",
      "coyno",
      "trustees",
      "fyend",
      "welsh",
      "incomedate",
      "income",
      "grouptype",
      "email",
      "web"]
}


def import_zip(zip_file, output_folder_name):
    zf = zipfile.ZipFile(zip_file, 'r')
    print('Opened zip file: %s' % zip_file)
    for filename in cc_files:
        try:
            bcp_filename = filename + '.bcp'
            csv_filename = output_folder_name + "\\" + filename + '.csv'
            bcpdata = zf.read(bcp_filename)
            bcpdata = bcpdata.decode('utf-8', errors="replace")
            bcpdata = bcp.convert(bcpdata)
            bcp.to_file(bcpdata, csvfilename=csv_filename, col_headers=cc_files[filename])
            print('Converted: %s' % bcp_filename)
        except KeyError:
            print('ERROR: Did not find %s in zip file' % bcp_filename)


def main():
    zip_file = sys.argv[1]
    output_folder_name = sys.argv[2]
    import_zip(zip_file, output_folder_name)

if __name__ == '__main__':
    main()