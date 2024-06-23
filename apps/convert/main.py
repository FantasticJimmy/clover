#!/usr/bin/env python
# -*- coding: utf-8 -*-


import os
import pandas as pd
import json
from concurrent import futures

# grpc libs
import grpc
import app_pb2_grpc
import app_pb2


constants_dict = {
    "TEXT": lambda input: str(input),
    "INTEGER": lambda input: int(input),
    "BOOLEAN": lambda input: bool(int(input)),
}


specs_dir = os.path.join("specs")
data_dir = os.path.join("data")
out_dir = os.path.join("output")


def get_csv_files(directory):
    """Get a list of CSV files in the given directory."""
    return [f for f in os.listdir(directory) if f.endswith(".csv")]


def get_txt_files(directory):
    return [f for f in os.listdir(directory) if f.endswith(".txt")]


def read_csv_to_dict(file_path):
    """Read a CSV file and convert it to JSON format."""
    df = pd.read_csv(file_path)
    return df.to_dict(orient="records")


def match_files(specs, data):
    """Match files in the data directory based on the specs guidelines."""
    matched_files = {}
    for spec_file in specs:
        prefix = spec_file.split(".")[
            0
        ]  # Get the prefix, assuming files have extensions
        matched_files[spec_file] = [
            data_file for data_file in data if data_file.split("_")[0] == prefix
        ]

    return matched_files


def process_file(data_filename, spec):
    try:
        file_path = os.path.join(data_dir, data_filename)
        rule_path = os.path.join(specs_dir, spec)
        output_path = os.path.join(out_dir, data_filename.replace(".txt", ".ndjson"))
        rules = read_csv_to_dict(rule_path)
        events = []
        with open(file_path, "r") as file:
            # Continue reading lines until the end of the file
            for line in file:
                # Read the next line
                result_dict = {}
                string_counter = 0
                for rule in rules:
                    content = line[string_counter : string_counter + rule["width"]]
                    result_dict[rule["column name"]] = constants_dict[rule["datatype"]](
                        content
                    )
                    string_counter = string_counter + rule["width"]
                events.append(result_dict)

        ndjson_string = "\n".join(json.dumps(item) for item in events)
        with open(output_path, "w") as file:
            file.write(ndjson_string)

        return events
    except Exception as e:
        print(e)
        return 0


def process():
    spec_files = get_csv_files(specs_dir)
    data_files = get_txt_files(data_dir)

    if not spec_files:
        print(f"No CSV files found in the directory: {specs_dir}")
        return

    dict_to_process = match_files(spec_files, data_files)
    result_dict = {}
    for key, values in dict_to_process.items():
        files_done_processing = []
        for value in values:
            processed_file = process_file(value, key)
            files_done_processing.append(processed_file)
        result_dict[key] = list

    # result_dict = {
    #     key: [process_data(value, key) for value in values]
    #     for key, values in dict_to_process.items()
    # }

    # processed all files but only returning the last processed data file
    return processed_file


class AppService(app_pb2_grpc.AppServiceServicer):
    def GetResponse(self, request, context):
        response = app_pb2.Response()
        response.reply = f"Hello, {request.message} from python"
        return response

    def GetResult(self, request, context):
        result = process()
        print(f"{result}")
        result_list_instance = app_pb2.ResultList()
        for item in result:
            new_instance = app_pb2.Result()
            new_instance.event_name = item["name"]
            new_instance.count = item["count"]
            new_instance.valid = item["valid"]
            result_list_instance.results.append(new_instance)
        return result_list_instance


def main():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    app_pb2_grpc.add_AppServiceServicer_to_server(AppService(), server)
    port = 50051
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"Port is running on {port}")
    server.wait_for_termination()


if __name__ == "__main__":
    main()
